import { screen, waitFor } from '@testing-library/react';

export const expectLoadingSpinner = () => {
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
};

export const expectErrorView = async () => {
  await waitFor(() => {
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
  });
};
  