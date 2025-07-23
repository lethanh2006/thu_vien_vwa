import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaSinhVien = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	condition?: Partial<KhoaSinhVien.IRecord>;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	loadData?: boolean;
	placeholder?: string;
}) => {
	const {
		value,
		onChange,
		multiple,
		condition,
		allowClear,
		disabled,
		style,
		isSetRecord,
		selectMa,
		loadData,
		placeholder,
	} = props;
	const { danhSach, getAllModel, loading, record, setRecord } = useModel('daotao.khoasinhvien');

	useEffect(() => {
		if (loadData !== false)
			getAllModel(undefined, { namHocBatDau: -1 }, condition).then((res) => {
				const khoa = res.find((i) => i.ma === record?.ma);
				if (isSetRecord) setRecord(khoa ?? res?.[0]);
				else if (onChange) setRecord(khoa);
			});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item.ma ?? item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn khóa sinh viên'}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectKhoaSinhVien;
