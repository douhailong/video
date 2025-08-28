import ProfileSection from '../components/profile-section';
import TabsSection from '../components/tabs-section';

type SelfViewProps = { tab?: string; subTab?: string };

const SelfView = ({ tab, subTab }: SelfViewProps) => {
  return (
    <div className='mx-auto mb-5 max-w-[2400px] px-4 pt-2.5'>
      <ProfileSection />
      <TabsSection tab={tab} subTab={subTab} />
    </div>
  );
};

export default SelfView;
