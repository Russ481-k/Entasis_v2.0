import dynamic from 'next/dynamic';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './custom-quill.css';

// 커스텀 CSS 파일 import
interface ForwardedQuillComponent extends ReactQuillProps {
  forwardedRef: React.Ref<ReactQuill>;
}

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: QuillComponent } = await import('react-quill');
    const Quill = ({ forwardedRef, ...props }: ForwardedQuillComponent) => (
      <QuillComponent
        ref={forwardedRef}
        style={{
          height: '420px',
          width: '100%',
          marginBottom: '56px',
          borderColor: 'gray.800',
          borderRadius: '0.5em',
        }}
        {...props}
      />
    );
    return Quill;
  },
  { loading: () => <div>...loading</div>, ssr: false }
);

export default QuillNoSSRWrapper;
