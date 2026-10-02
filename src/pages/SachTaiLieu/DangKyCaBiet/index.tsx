import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import {
	colorTrangThaiDangKyCaBiet,
	ETrangThaiDangKyCaBiet,
	nameTrangThaiDangKyCaBiet,
	nameTrangThaiDangKyCaBietV2,
} from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { HistoryOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';
import { DKCBActionAlert, DKCBDeleteSelected, DKCBRowActions } from './components/Actions';
import FormDangKyCaBiet from './components/Form';
import ManualAddDKCB from './components/ManualAdd';
import StatDanhSachDKCB from './components/Stat';
import useDKCBActions from './components/useDKCBActions';

const DangKyCaBietPage = () => {
	const { getSettingModel, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, record, setRecord } = useModel('sachtailieu.anpham.anphamxepgia');

	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<string>('ALL');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const getData = () => {
		return getModel(trangThai === 'ALL' ? undefined : { trangThai: trangThai as any });
	};
	const actions = useDKCBActions({ scope: trangThai, getData });

	const onCell = (rec: AnPham.IAnPhamXepGia) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleModal(true);
		},
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian xếp giá',
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (_, rec) => (rec.thongTinXepGia?.donGia == null ? null : `${inputFormat(rec.thongTinXepGia.donGia)} VNĐ`),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<Tag color={colorTrangThaiDangKyCaBiet[val as ETrangThaiDangKyCaBiet]}>
					{nameTrangThaiDangKyCaBietV2[val as ETrangThaiDangKyCaBiet]}
				</Tag>
			),
			fixed: 'right',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 140,
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
					<DKCBRowActions record={rec} {...actions} />
				</>
			),
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab='Tất cả' />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>
			<DKCBActionAlert error={actions.actionError} />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				rowSelection
				deleteMany={false}
				detailRow={{ getCheckboxProps: () => ({ disabled: actions.busy }) }}
				otherButtons={[
					<ManualAddDKCB key='create-dkcb' disabled={actions.busy} onCreated={actions.refresh} />,
					<DKCBDeleteSelected key='delete-dkcb' {...actions} />,
				]}
				hideCard
				Form={FormDangKyCaBiet}
				formProps={{ getData }}
				widthDrawer={800}
			/>

			<LichSuThueMuonPage
				title='Lịch sử thuê mượn'
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }}
			/>
		</Card>
	);
};

export default DangKyCaBietPage;
