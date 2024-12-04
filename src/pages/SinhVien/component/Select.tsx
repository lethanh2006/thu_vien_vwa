import { EOperatorType } from '@/components/Table/constant';
import type { ETrangThaiHocSv } from '@/services/SinhVien/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SelectSinhVienDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	trangThaiHoc?: ETrangThaiHocSv[];
	isView?: boolean;
	allowClear?: boolean;
	condition?: Partial<SinhVien.IRecord>;
}) => {
	const { value, onChange, multiple, disabled, style, selectMa, trangThaiHoc, allowClear, condition } = props;
	const { danhSach, getModel, loading, searchSinhVienModel } = useModel('sinhvien.sinhvien');
	const [keyword, setKeyword] = useState<string>();

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render
		const gotData = danhSach.some((item) =>
			Array.isArray(value)
				? value.includes(selectMa ? item.ma : item.ssoId)
				: value === (selectMa ? item.ma : item.ssoId),
		);

		if (keyword) searchSinhVienModel(keyword, trangThaiHoc, undefined, condition);
		else if (!gotData)
			getModel(
				condition,
				value?.length
					? [
							{
								field: selectMa ? 'ma' : 'ssoId',
								values: Array.isArray(value) ? value : [value],
								operator: EOperatorType.INCLUDE,
							},
					  ]
					: !!trangThaiHoc
					? [
							{
								field: 'trangThaiHoc',
								operator: EOperatorType.INCLUDE,
								values: trangThaiHoc,
							},
					  ]
					: undefined,
				undefined,
				1,
				20,
			);
	}, [keyword, JSON.stringify(value)]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setKeyword(val);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		<>
			{dataView?.ten ?? ''} - {dataView?.ma ?? ''}
		</>
	) : (
		<Select
			loading={loading}
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
				key: item?.ssoId,
				value: selectMa ? item.ma : item?.ssoId,
				label: `${item.ten} - ${item.ma}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn sinh viên (tìm theo họ tên hoặc mã sinh viên)'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectSinhVienDebounce;
