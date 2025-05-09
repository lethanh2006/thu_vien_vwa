import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';

const ThuVienQuocThe = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.thuvienquocte');

	const columns: IColumn<Z3950.IMayChu>[] = [
		{
			title: 'Tên máy chủ',
			dataIndex: 'name',
			width: 180,
			filterType: 'string',
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.thuvienquocte'
			title='Máy chủ thư viện quốc tế'
			buttons={{ create: false }}
		/>
	);
};

export default ThuVienQuocThe;
