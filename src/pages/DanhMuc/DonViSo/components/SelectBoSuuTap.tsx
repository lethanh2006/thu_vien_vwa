import { Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectBoSuuTap = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	idDonViSo: string;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, style, idDonViSo } = props;
	const { getAllModel } = useModel('sachtailieu.anpham.anpham');
	const [danhSach, setDanhSach] = useState<DonViSo.IRecord[]>();

	useEffect(() => {
		if (idDonViSo)
			getAllModel(undefined, undefined, undefined, undefined, `/public/dspace/collections/${idDonViSo}`, false).then(
				(data: any) => {
					setDanhSach(data?._embedded?.collections ?? []);
				},
			);
	}, [idDonViSo]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled || !idDonViSo}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={_.filter(danhSach, (item) => _.trim(item?.name)).map((item: any) => ({
				value: item.id,
				label: item?.name,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn bộ sưu tập'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectBoSuuTap;
