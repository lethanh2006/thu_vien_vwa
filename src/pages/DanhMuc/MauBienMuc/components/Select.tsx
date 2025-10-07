import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectMauBienMuc = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<MauBienMuc.IRecord>;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, selectMa, disabled } = props;
	const { danhSach, getAllModel, getModel } = useModel('danhmuc.maubienmuc');

	// useEffect(() => {
	// 	if (!danhSach?.length) getAllModel(!!isSetRecord, undefined, condition);
	// }, []);

	//Get page để lấy thongTinKhaiBao vì getMany không có dữ liệu
	useEffect(() => {
		if (!danhSach?.length) getModel(undefined, undefined, undefined, 1, 200);
	}, []);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn tình trạng sử dụng'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectMauBienMuc;
