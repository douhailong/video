type ErrorProps = { text?: string; error?: Error };

const Error = ({ text = 'Error...', error }: ErrorProps) => {
  return (
    <div>
      <button type='button' className='cursor-pointer'>
        {text}
      </button>
    </div>
  );
};

export default Error;
