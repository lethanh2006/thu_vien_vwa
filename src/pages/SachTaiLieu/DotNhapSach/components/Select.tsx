import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotNhapSach = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<AnPham.IDotNhapSach>;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('sachtailieu.anpham.dotnhapsach');

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
				value: item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn đợt nhập sách'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectDotNhapSach;
