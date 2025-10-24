import RichShelf from '../components/you-view/rich-shelf';
import HeaderRenderer from '@/modules/user/ui/components/header-renderer';

type YouViewProps = {};

const YouView = ({}: YouViewProps) => {
  return (
    <div className='pb-4'>
      <HeaderRenderer className='px-6 pt-6 sm:py-1.5' />
      <div className='px-5 pt-6 sm:px-6'>
        <RichShelf title='历史记录' />
        {/* <div className='bg-red-200'>11</div> */}
        <RichShelf title='播放列表' description='2 个视频' />
        <RichShelf title='稍后观看' description='2 个视频' />
        <RichShelf title='赞过的视频' description='2 个视频' />
        <RichShelf title='我的剪辑' description='2 个视频' />
      </div>
    </div>
  );
};

export default YouView;
