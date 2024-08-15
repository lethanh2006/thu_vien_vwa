import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaSinhVien = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	condition?: Partial<KhoaSinhVien.IRecord>;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	readOnly?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, disabled, style, isSetRecord, selectMa, readOnly } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.khoasinhvien');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord, { namHocBatDau: -1 }, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn khóa sinh viên'
			allowClear={allowClear ?? false}
			style={{ width: '100%', pointerEvents: readOnly ? 'none' : undefined, ...style }}
		/>
	);
};

export default SelectKhoaSinhVien;
