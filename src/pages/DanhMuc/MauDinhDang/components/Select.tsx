import { ELoaiMauDinhDang } from '@/services/DanhMuc/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDinhDangMaVach = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;

	disabled?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, disabled, selectMa } = props;
	const { danhSach, getAllModel } = useModel('danhmuc.maudinhdang');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, {
			loai: ELoaiMauDinhDang.MAU_BARCODE,
		});
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
				value: selectMa ? item?.ma : item?._id,
				label: item?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn mẫu mã vạch'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectDinhDangMaVach;
