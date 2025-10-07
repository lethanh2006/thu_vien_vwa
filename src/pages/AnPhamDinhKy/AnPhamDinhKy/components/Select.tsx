import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectAnPhamDinhKy = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<AnPhamDinhKy.IRecord>;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, selectMa, disabled } = props;
	const { dsAllAnPhamDinhKy, setDsAllAnPhamDinhKy, getAllModel } = useModel('anphamdinhky.anphamdinhky');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition, undefined, undefined, false).then((res) =>
			setDsAllAnPhamDinhKy(res),
		);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={dsAllAnPhamDinhKy.map((item) => ({
				key: item._id,
				value: selectMa ? item.maAnPhamDinhKy : item._id,
				label: [item.ten, item?.maAnPhamDinhKy].filter(Boolean).join(' - '),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn ấn phẩm dịnh kỳ'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectAnPhamDinhKy;
