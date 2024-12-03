import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SelectThongTinAnPhamDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isView?: boolean;
	allowClear?: boolean;
	condition?: Partial<AnPham.IThongTinAnPham>;
}) => {
	const { value, onChange, multiple, disabled, style, allowClear, condition } = props;
	const { danhSach, getModel, loading, searchThongTinAnPhamModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const [keyword, setKeyword] = useState<string>();

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render
		const gotData = danhSach.some((item) => (Array.isArray(value) ? value.includes(item._id) : value === item._id));

		if (keyword) searchThongTinAnPhamModel(keyword, undefined, condition);
		else if (!gotData) getModel(condition, undefined, undefined, 1, 20);
	}, [keyword, JSON.stringify(value)]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setKeyword(val);
	}, 800);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			options={danhSach.map((item) => ({
				key: item?._id,
				value: item?._id,
				label: `${item?.tagCode} - ${item?.value}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn thông tin ấn phẩm'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectThongTinAnPhamDebounce;
