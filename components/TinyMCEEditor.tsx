import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Import TinyMCE
import 'tinymce/tinymce';

// Import theme
import 'tinymce/themes/silver';

// Import plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

// Import content CSS
import 'tinymce/skins/ui/oxide/skin.min.css';

// Import content models
import 'tinymce/models/dom';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your description...",
  height = 300
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Configure TinyMCE base URL for self-hosted version
    if ((window as any).tinymce) {
      (window as any).tinymce.baseURL = '/tinymce';
    }
  }, []);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="tinymce-wrapper rounded-md overflow-hidden">
      <Editor
        licenseKey="gpl"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        init={{
          height: height,
          menubar: false,
          base_url: '/tinymce',
          suffix: '.min',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder,
          skin: 'oxide',
          content_css: '/tinymce/skins/content/default/content.min.css',
          branding: false,
          promotion: false,
          setup: (editor) => {
            // Add custom styles to match your theme
            editor.on('init', () => {
              // Check if dark mode is active and apply dark theme
              const isDarkMode = document.documentElement.classList.contains('dark');
              if (isDarkMode) {
                editor.dom.addStyle(`
                  body { 
                    background-color: #374151 !important; 
                    color: #f3f4f6 !important; 
                  }
                `);
              }
            });
          }
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default TinyMCEEditor;