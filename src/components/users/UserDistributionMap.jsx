import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { listUsers } from '../../actions/userActions';
import osmtogeojson from 'osmtogeojson';

const UserDistributionMap = () => {
  const [countyData, setCountyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const geoJsonLayer = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userList = useSelector((state) => state.userList);
  const { loading: usersLoading, error: usersError, users = [] } = userList;
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo?.user?.role === 'Admin') {
      dispatch(listUsers());
    } else {
      navigate('/dashboard');
    }
  }, [dispatch, navigate, userInfo]);

  // Count users by county
  const countUsersByCounty = () => {
    if (!users || users.length === 0) return {};
    return users.reduce((acc, user) => {
      if (user?.county) {
        const county = user.county.toLowerCase();
        acc[county] = (acc[county] || 0) + 1;
      }
      return acc;
    }, {});
  };

  // Fetch county boundaries from Overpass API
  useEffect(() => {
    const fetchCountyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get unique counties from users
        const counties = [...new Set(
          users
            .map(user => user.county?.toLowerCase())
            .filter(Boolean)
        )];
        console.log('Unique counties:', counties);

        if (counties.length === 0) {
          setLoading(false);
          return;
        }

        // Build improved Overpass QL query for Kenya counties
        // Try multiple approaches to find the counties
        const overpassQuery = `[out:json][timeout:60];
          (
            ${counties.map(county => `
              relation["boundary"="administrative"]["admin_level"="4"]["name:en"~"${county}",i];
              relation["boundary"="administrative"]["admin_level"="4"]["name"~"${county}",i];
              relation["boundary"="administrative"]["admin_level"="4"]["name:en"~"${county} county",i];
              relation["boundary"="administrative"]["admin_level"="4"]["name"~"${county} county",i];
            `).join('')}
          );
          out geom;`;

        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
          setCountyData(data.elements);
        } else {
          // If no data found, try alternative approach with just Kenya boundaries
          console.log('No county data found, trying alternative approach...');
          await fetchKenyaCounties(counties);
        }
      } catch (err) {
        console.error('Error fetching county data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchKenyaCounties = async (counties) => {
      try {
        // Alternative: Get all Kenya counties and filter
        const altQuery = `[out:json][timeout:60];
          (
            relation["boundary"="administrative"]["admin_level"="4"]["ISO3166-1"="KE"];
            relation["boundary"="administrative"]["admin_level"="4"]["country"="Kenya"];
            relation["boundary"="administrative"]["admin_level"="4"]["place"="county"]["country"="Kenya"];
          );
          out geom;`;

        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(altQuery)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Alternative county data:', data);
        
        if (data.elements && data.elements.length > 0) {
          // Filter for counties that match our user counties
          const matchingCounties = data.elements.filter(element => {
            const countyName = (element.tags?.['name:en'] || element.tags?.name || '').toLowerCase();
            return counties.some(userCounty => 
              countyName.includes(userCounty) || 
              userCounty.includes(countyName.replace(' county', ''))
            );
          });
          
          console.log('Matching counties found:', matchingCounties);
          setCountyData(matchingCounties);
        } else {
          setError('No county boundary data found for Kenya');
        }
      } catch (err) {
        console.error('Error in alternative fetch:', err);
        setError('Failed to fetch county boundaries');
      }
    };

    if (users.length > 0) {
      fetchCountyData();
    }
  }, [users]);

  // Convert Overpass geometry to GeoJSON coordinates
  const convertGeometry = (geometry) => {
    if (!geometry || geometry.length === 0) return [];
    
    return geometry.map(coord => [coord.lon, coord.lat]);
  };

  // Style function for GeoJSON features
  const styleFeature = (feature) => {
    const countyName = (feature.properties['name:en'] || feature.properties.name || '').toLowerCase();
    const userCounts = countUsersByCounty();
    
    // Try to match county name more flexibly
    let userCount = 0;
    Object.keys(userCounts).forEach(userCounty => {
      if (countyName.includes(userCounty) || userCounty.includes(countyName.replace(' county', ''))) {
        userCount = userCounts[userCounty];
      }
    });
    
    // Color based on user count
    let fillColor = '#cccccc'; // Default color for no users
    
    if (userCount > 0) {
      const maxCount = Math.max(...Object.values(userCounts), 1);
      const ratio = maxCount > 0 ? userCount / maxCount : 0;
      
      if (ratio < 0.33) {
        fillColor = '#a1d99b'; // Light green
      } else if (ratio < 0.66) {
        fillColor = '#fec44f'; // Orange
      } else {
        fillColor = '#de2d26'; // Red
      }
    }
    
    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Highlight feature on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    if (typeof layer.setStyle === 'function') {
        layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
        });
        if (typeof layer.bringToFront === 'function') {
        layer.bringToFront();
        }
    }
    };

    const resetHighlight = (e) => {
    if (geoJsonLayer.current?.resetStyle && typeof e.target.setStyle === 'function') {
        geoJsonLayer.current.resetStyle(e.target);
    }
    };

    const zoomToFeature = (e) => {
    const layer = e.target;
    const map = layer._map;
    if (typeof layer.getBounds === 'function') {
        map.fitBounds(layer.getBounds());
    }
    };


  // Add event listeners to each feature
  const onEachFeature = (feature, layer) => {
    const countyName = feature.properties['name:en'] || feature.properties.name || 'Unknown';
    const userCounts = countUsersByCounty();
    console.log('User counts:', userCounts, 'for county:', countyName, 'feature:', feature);
    
    // Try to match county name more flexibly
    let userCount = 0;
    Object.keys(userCounts).forEach(userCounty => {
      const cleanCountyName = countyName.toLowerCase().replace(' county', '');
      if (cleanCountyName.includes(userCounty) || userCounty.includes(cleanCountyName)) {
        userCount = userCounts[userCounty];
      }
    });
    
    layer.bindPopup(`
      <b>${countyName}</b><br/>
      Users: ${userCount}
    `);
    
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  };

  if (usersLoading) return <div className="text-center py-8">Loading user data...</div>;
  if (usersError) return <div className="text-center py-8 text-red-600">Error loading users: {usersError}</div>;
  if (loading) return <div className="text-center py-8">Loading map data...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading map: {error}</div>;
  if (!countyData || countyData.length === 0) return <div className="text-center py-8">No county data available for the current users</div>;

  const geoJsonData = osmtogeojson({ elements: countyData });
  

  console.log('GeoJSON data:', geoJsonData);

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[-0.0236, 37.9062]} // Kenya coordinates
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData.features.length > 0 && (
          <GeoJSON
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={onEachFeature}
            ref={geoJsonLayer}
          />
        )}
      </MapContainer>
      <div className="p-4 bg-white border-t">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#a1d99b]"></div>
            <span>Low density</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#fec44f]"></div>
            <span>Medium density</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#de2d26]"></div>
            <span>High density</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDistributionMap;