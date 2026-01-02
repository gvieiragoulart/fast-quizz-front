import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../hooks/useAuth';

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    // Set up authentication
    localStorage.setItem('authToken', 'test-token');

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Clean up
    localStorage.removeItem('authToken');
  });
});
