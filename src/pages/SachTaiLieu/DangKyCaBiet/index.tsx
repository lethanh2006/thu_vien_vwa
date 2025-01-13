import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { HistoryOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import StatDanhSachDKCB from '../AnPham/DanhSachDKCB/components/Stat';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';

const DangKyCaBietPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, record, setRecord } = useModel('sachtailieu.anpham.anphamxepgia');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Thời gian xếp giá',
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			width: 120,
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Lịch sử đăng ký'
						onClick={() => {
							setRecord(rec);
							setVisibleModal(true);
						}}
						type='link'
						icon={<HistoryOutlined />}
					/>
					<ButtonExtend tooltip='Thuê mượn' onClick={() => handleEdit(rec)} type='link' icon={<PlusCircleOutlined />} />
				</>
			),
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
			/>

			<Modal
				title='Lịch sử thuê mượn'
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				width={1100}
				footer={null}
			>
				<LichSuThueMuonPage condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Modal>
		</Card>
	);
};

export default DangKyCaBietPage;
