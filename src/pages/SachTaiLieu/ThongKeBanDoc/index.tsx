import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { Button, Modal, Segmented } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';

const ThongKeBanDocPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, record, setRecord } = useModel('sachtailieu.muontra.danhsachbandoc');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('sinh-vien');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, `thong-ke/${activeKey}`);
	};

	const onCell = (rec: SinhVien.IRecord & ToChucNhanSu.INhanSu) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleModal(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord & ToChucNhanSu.INhanSu>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'ma',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Mã cán bộ',
			dataIndex: 'maCanBo',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'Họ tên',
			width: 150,
			render: (val, rec: any) => [rec?.hoDem, rec?.ten]?.filter(Boolean).join(' '),
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'Đơn vị',
			dataIndex: 'donViChinhId' as any,
			width: 150,
			render: (val, rec) => rec?.donViChinh?.ten,
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'SL chờ xử lý',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.choXuLy,
			width: 80,
			onCell,
		},
		{
			title: 'SL đang thuê mượn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.dangThueMuon,
			width: 80,
			onCell,
		},
		{
			title: 'SL đã trả',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.daTra,
			width: 80,
			onCell,
		},
		{
			title: 'SL quá hạn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.quaHan,
			width: 80,
			onCell,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, activeKey]}
				modelName='sachtailieu.muontra.danhsachbandoc'
				widthDrawer={1100}
				title='Thống kê bạn đọc'
				buttons={{ create: false }}
				otherButtons={[
					<Segmented
						key={'1'}
						value={activeKey}
						onChange={(value) => setActiveKey(value.toString())}
						options={[
							{ value: 'sinh-vien', label: 'Sinh viên' },
							{ value: 'can-bo', label: 'Cán bộ/Giảng viên' },
						]}
					/>,
				]}
			/>
			<Modal
				title={`Danh sách lịch sử mượn trả sách người mượn ${
					activeKey === 'sinh-vien' ? record?.ten : [record?.hoDem, record?.ten]?.filter(Boolean).join(' ')
				}`}
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				width={1100}
				footer={null}
			>
				<LichSuThueMuonPage ssoId={record?.ssoId} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Modal>
		</>
	);
};

export default ThongKeBanDocPage;
