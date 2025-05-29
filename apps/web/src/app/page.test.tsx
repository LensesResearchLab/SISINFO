import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

describe('Landing Page', () => {
    it('should render the landing page with description', () => {
        render(<LandingPage />);
        const description: string = 'Sistema de Información para la gestión de tesis y asistencias graduadas del Departamento de Ingeniería de Sistemas y Computación';
        expect(screen.getByText(description)).toBeInTheDocument();
    });
});
