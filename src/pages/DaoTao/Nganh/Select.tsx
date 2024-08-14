import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNganhCoSo = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	condition?: Partial<NganhDaoTao.IRecordCoSo>;
	disabled?: boolean;
	readOnly?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, hasDefault, style, selectMa, condition, disabled, readOnly } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.nganhdaotao');

	const getData = async () => {
		if (!visibleForm) {
			getAllModel(false, undefined, { ...condition, parentId: null }).then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && !!onChange) onChange(selectMa ? data?.[0]?.ma : data?.[0]?._id);
			});
		}
	};

	useEffect(() => {
		getData();
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item?.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn ngành đào tạo'
			allowClear={allowClear ?? false}
			style={{ width: '100%', pointerEvents: readOnly ? 'none' : undefined, ...style }}
			removeIcon={readOnly ? null : undefined}
		/>
	);
};

export default SelectNganhCoSo;
