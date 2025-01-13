import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';

const ThongKeBanDocPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, record, setRecord } = useModel('sachtailieu.muontra.danhsachbandoc');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'thong-ke/sinh-vien');
	};

	const onCell = (rec: SinhVien.IRecord) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleModal(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'ma',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
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
				dependencies={[page, limit]}
				modelName='sachtailieu.muontra.danhsachbandoc'
				widthDrawer={1100}
				title='Thống kê bạn đọc'
				buttons={{ create: false }}
			/>
			<Modal
				title={`Danh sách lịch sử mượn trả sách sinh viên ${record?.ten}`}
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				width={1100}
				footer={null}
			>
				<LichSuThueMuonPage condition={{ ssoIdNguoiMuon: record?.ssoId }} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Modal>
		</>
	);
};

export default ThongKeBanDocPage;
