import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonVi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	allowClear?: boolean;
	placeholder?: string;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, disabled, style, allowClear, placeholder, selectMa } = props;
	const { danhSach, getAllModel, loading } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		// Fix cứng Bộ môn
		// [
		// 	{
		// 		active: true,
		// 		field: 'loaiPhongBanId',
		// 		values: ['64803abec0fb527080456a32'],
		// 		operator: EOperatorType.EQUAL,
		// 	},
		// ];
		if (!danhSach.length)
			getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				['_id', 'maDonVi', 'ten', 'tenVietTat'],
				{ population: [{ path: 'loaiPhongBan' }] },
			);
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.maDonVi : item?._id,
				label: `${item.ten} (${item.maDonVi ?? ''})`,
			}))}
			showSearch
			showArrow
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn đơn vị'}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectDonVi;
