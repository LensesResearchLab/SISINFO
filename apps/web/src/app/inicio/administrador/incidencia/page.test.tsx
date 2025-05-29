import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as services from '@/app/services/incidences.service';
import { Incidence } from '@/app/types/entities/incidence.type';
import IncidenceList from './page';
import { expectErrorView, expectLoadingSpinner } from '../../../../../test/test-utils/ui-assertions';

jest.mock('../../../services/incidences.service');

const mockIncidences: Incidence[] = [
  {
    id: '1',
    description: 'No puedo inscribir una tesis para el periodo actual',
    type: 'Error en el sistema',
    isClosed: false,
    date: '2025-05-27',
  },
];

describe('IncidenceList', () => {
  let queryClient: QueryClient;

  const renderWithClient = (ui: React.ReactNode) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('shows a spinner while loading', () => {
    (services.getAllIncidences as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithClient(<IncidenceList />);
    expectLoadingSpinner();
  });
  
  it('shows an error page on failure', async () => {
    (services.getAllIncidences as jest.Mock).mockRejectedValue(new Error('Error'));
    renderWithClient(<IncidenceList />);
    await expectErrorView();
  });

  it('renders the table with data', async () => {
    (services.getAllIncidences as jest.Mock).mockResolvedValue(mockIncidences);
    renderWithClient(<IncidenceList />);
    expect(await screen.findByText(/No puedo inscribir una tesis para el periodo actual/i)).toBeInTheDocument();
    expect(screen.getByText(/Completar/i)).toBeInTheDocument();
  });

  it('disables the "Completar" button if the incidence is already closed', async () => {
    (services.getAllIncidences as jest.Mock).mockResolvedValue([
      { ...mockIncidences[0], isClosed: true },
    ]);
    renderWithClient(<IncidenceList />);
    const button = await screen.findByRole('button', { name: /Completar/i });
    expect(button).toBeDisabled();
  });
});
