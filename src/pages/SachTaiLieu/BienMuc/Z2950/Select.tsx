import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectMayChu = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, disabled } = props;
	const { danhSach, getAllModel } = useModel('danhmuc.thuvienquocte');

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach?.map((item) => ({
				key: item.host,
				value: item.host,
				label: item.name,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn máy chủ'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectMayChu;
