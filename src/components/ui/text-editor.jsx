import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/assets/styles/cvc.css';

export const ReactQuillEditor = ({
	id,
	value,
	onChange,
	placeholder,
	toolbarOptions,
}) => {
	const modules = {
		toolbar: toolbarOptions || [
			[{ size: ['small', false, 'large', 'huge'] }],
			['bold', 'italic', 'underline', 'strike', 'link'],
			[{ header: 1 }, { header: 2 }],
			[{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
			['clean'],
		],
	};

	return (
		<ReactQuill
			id={id}
			theme='snow'
			modules={modules}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
};

ReactQuillEditor.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	toolbarOptions: PropTypes.array,
};
