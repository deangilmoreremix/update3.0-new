// This file has been replaced by ExactNavbar.tsx
// Keeping this as a simple redirect to avoid import conflicts

import ExactNavbar from './layout/ExactNavbar';

interface NavbarProps {
  onOpenPipelineModal?: () => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  return <ExactNavbar {...props} />;
};

export default Navbar;