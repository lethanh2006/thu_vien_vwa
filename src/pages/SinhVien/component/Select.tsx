import { EOperatorType } from '@/components/Table/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import { Select, Spin, Empty } from 'antd';
import { type BaseOptionType } from 'antd/lib/select';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectSinhVienDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, option?: BaseOptionType) => void;
	multiple?: boolean;
	disabled?: boolean;
	keyValue?: keyof SinhVien.IRecord;
	hideMaSinhVien?: boolean;
	ignoreOptions?: string[];
	isView?: boolean;
	style?: React.CSSProperties;
}): any => {
	const { value, onChange, multiple, disabled, keyValue = 'ssoId', hideMaSinhVien, ignoreOptions, style } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getModel(
			undefined,
			(!filters || !filters.length) && value
				? [
						{
							active: true,
							field: 'ssoId',
							values: Array.isArray(value) ? value : [value],
							operator: EOperatorType.INCLUDE,
						},
				  ]
				: undefined,
			undefined,
			1,
			20,
		);
	}, [filters, value]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		`${dataView?.ten ?? ''} - ${dataView?.ma ?? ''}`
	) : (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
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
				key: item?.[keyValue],
				value: item?.[keyValue],
				label: hideMaSinhVien ? item.ten : `${item.ten} - ${item.ma}`,
				rawData: item,
				disabled: !!ignoreOptions?.find((optionValue) => optionValue === item?.[keyValue]),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn sinh viên (tìm kiếm theo họ tên sinh viên)'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectSinhVienDebounce;
