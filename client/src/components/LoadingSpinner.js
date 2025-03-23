import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = () => (
  <div className="loading-container">
    <ProgressSpinner />
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner; 