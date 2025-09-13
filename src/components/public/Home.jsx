import { 
  Wallet, 
  Users, 
  Calendar, 
  Handshake, 
  ShieldCheck, 
  TrendingUp, 
  Smartphone, 
  CreditCard,
  BarChart2,
  Lock
} from 'lucide-react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Revolutionize Your Group Finances
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          The all-in-one platform for managing group savings, loans, and investments with 
          unmatched security and convenience.
        </p>
        <div className="flex gap-4 justify-center">
          <LinkContainer to="/register">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
          </LinkContainer>
          <LinkContainer to="/how-it-works">
          <Button size="lg" variant="outline" className="border-blue-600 text-primary">
            How It Works
          </Button>
          </LinkContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Powerful Features for Your Financial Groups
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Group Management</h3>
              <p className="text-muted-foreground">
                Easily create and manage different group types like chamas, Saccos, 
                table banking, and investment clubs in one place.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Wallet className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Digital Wallet</h3>
              <p className="text-muted-foreground">
                Fund your wallet seamlessly via M-Pesa and debit cards. Withdraw 
                your money anytime with just a few taps.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Handshake className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Group Loans</h3>
              <p className="text-muted-foreground">
                Access loans from your group savings with transparent terms. 
                Trusted members can borrow directly from the group manager.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Meeting Coordination</h3>
              <p className="text-muted-foreground">
                Schedule and track group meetings with automatic reminders and 
                attendance tracking for better accountability.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                Your funds and data are protected with enterprise-grade encryption 
                and multi-factor authentication.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-muted border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Growth Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your group's financial progress with intuitive charts and 
                reports to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Simple Steps to Financial Control
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create or Join a Group</h3>
              <p>
                Start a new financial group or join an existing one with a simple 
                invitation code.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fund Your Wallet</h3>
              <p>
                Add money to your secure wallet using M-Pesa or your debit card 
                for seamless transactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage & Grow</h3>
              <p>
                Contribute to group savings, access loans, and track your financial 
                growth all in one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Spotlight */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="text-primary" size={24} />
                <span className="font-semibold text-primary">SECURITY FIRST</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Your Money is Protected at Every Step
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={18} />
                  <span>End-to-end encryption for all transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={18} />
                  <span>Biometric authentication for sensitive actions</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={18} />
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={18} />
                  <span>Transparent group transaction records</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-muted rounded-xl p-8 border">
              <div className="flex items-center gap-4 mb-6">
                <Smartphone className="text-primary" size={32} />
                <CreditCard className="text-primary" size={32} />
                <BarChart2 className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                All Your Financial Tools in One Place
              </h3>
              <p className="text-muted-foreground mb-6">
                Whether you're contributing to your group savings, applying for a loan, 
                or tracking your investment growth, our platform provides all the tools 
                you need with uncompromising security.
              </p>
              <Button variant="outline" className="border-blue-600 text-primary">
                Learn About Our Security
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Group Finances?</h2>
          <p className="text-xl mb-8">
            Join thousands of groups managing their money smarter and safer with our platform.
          </p>
          <LinkContainer  to="/register">
          <Button size="lg"  variant="secondary">
            Create Your Free Account
          </Button>
          </LinkContainer>
        </div>
      </section>
    </div>
  );
}