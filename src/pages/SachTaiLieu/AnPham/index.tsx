import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';

const CardAnPham = () => {
	const intl = useIntl();
	const { page, limit, handleView, isView } = useModel('sachtailieu.anpham.anpham');

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã ấn phẩm',
			dataIndex: 'ten',
			width: 120,
			render: (val, rec) => val ?? 'Không có thông tin',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={isView ? ModalAnPham : Form}
				widthDrawer={1100}
				buttons={{ create: false }}
				hideCard
			/>
		</Card>
	);
};

export default CardAnPham;
