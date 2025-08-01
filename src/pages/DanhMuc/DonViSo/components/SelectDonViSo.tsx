import { Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonViSo = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, style } = props;
	const { getAllModel } = useModel('sachtailieu.anpham.anpham');
	const [danhSach, setDanhSach] = useState<DonViSo.IRecord[]>();

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, '/public/dspace/communities', false).then((data: any) => {
			setDanhSach(data?._embedded?.communities ?? []);
		});
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={_.filter(danhSach, (item) => _.trim(item?.name)).map((item: any) => ({
				value: item.id,
				label: item.name,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn đơn vị số'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectDonViSo;
