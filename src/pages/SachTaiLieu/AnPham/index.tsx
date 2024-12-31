import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';

const CardAnPham = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, setRecord } = useModel('sachtailieu.anpham.anpham');
	const [visibleXepGia, setVisibleXepGia] = useState<boolean>(false);

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.DA_BIEN_MUC });
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
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
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
					<ButtonExtend
						tooltip='Xếp giá'
						onClick={() => {
							setRecord(rec);
							setVisibleXepGia(true);
						}}
						type='link'
						icon={<DollarOutlined />}
					/>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={ModalAnPham}
				widthDrawer={1100}
				buttons={{ create: false }}
				hideCard
			/>

			<ModalXepGia visibleForm={visibleXepGia} setVisibleForm={setVisibleXepGia} />
		</Card>
	);
};

export default CardAnPham;
