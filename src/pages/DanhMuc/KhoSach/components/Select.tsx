import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoSach = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<KhoSach.IRecord>;
	disabled?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled, selectMa } = props;
	const { danhSach, getAllModel } = useModel('danhmuc.khosach');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item?.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn kho sách'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectKhoSach;
