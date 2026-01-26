import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { Segmented } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';

const DanhSachBanDocPage = () => {
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
			title: intl.formatMessage({ id: 'sachtailieu.sinhVien.maSV' }),
			dataIndex: 'ma',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.sinhVien.hoTen' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.sinhVien.ngaySinh' }),
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.sinhVien.khoaNganh' }),
			dataIndex: 'maKhoaNganh',
			width: 180,
			render: (val, rec) => rec.khoaNganh?.ten ?? val,
			onCell,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.canBo.maCB' }),
			dataIndex: 'maCanBo',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.canBo.hoTen' }),
			width: 150,
			render: (val, rec: any) => [rec?.hoDem, rec?.ten]?.filter(Boolean).join(' '),
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.canBo.donVi' }),
			dataIndex: 'donViChinhId' as any,
			width: 150,
			render: (val, rec) => rec?.donViChinh?.ten,
			onCell,
			hide: activeKey !== 'can-bo',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.soLuongChoXuLy' }),
			align: 'center',
			render: (val, rec) => rec?.thongKe?.choXuLy,
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.soLuongDangThueMuon' }),
			align: 'center',
			render: (val, rec) => rec?.thongKe?.dangThueMuon,
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.soLuongDaTra' }),
			align: 'center',
			render: (val, rec) => rec?.thongKe?.daTra,
			width: 80,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.soLuongQuaHan' }),
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
				title={intl.formatMessage({ id: 'sachtailieu.danhSachBanDoc' })}
				buttons={{ create: false }}
				otherButtons={[
					<Segmented
						key={'1'}
						value={activeKey}
						onChange={(value) => setActiveKey(value.toString())}
						options={[
							{ value: 'sinh-vien', label: intl.formatMessage({ id: 'sachtailieu.sinhVien.title' }) },
							{ value: 'can-bo', label: intl.formatMessage({ id: 'sachtailieu.canBo.title' }) },
						]}
					/>,
				]}
			/>

			<LichSuThueMuonPage
				title={`${intl.formatMessage({ id: 'sachtailieu.anpham.danhSachLichSu' })} ${
					activeKey === 'sinh-vien' ? record?.ten : [record?.hoDem, record?.ten]?.filter(Boolean).join(' ')
				}`}
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				ssoId={record?.ssoId}
			/>
		</>
	);
};

export default DanhSachBanDocPage;
