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
import { HistoryOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';
import FormDangKyCaBiet from './components/Form';
import ModalThemDKCB from './components/ModalThemDKCB';
import StatDanhSachDKCB from './components/Stat';
import ThaoTacDKCB, { XoaNhieuDKCB } from './components/ThaoTac';

const DangKyCaBietPage = () => {
	const intl = useIntl();
	const { getSettingModel, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, record, setRecord, thongKeDangKyCaBietModel } = useModel(
		'sachtailieu.anpham.anphamxepgia',
	);

	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleThemDKCB, setVisibleThemDKCB] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<string>('ALL');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const getData = () => {
		if (trangThai === 'ALL') getModel();
		else getModel({ trangThai: trangThai as any });
	};

	const getThongKe = () => thongKeDangKyCaBietModel();

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
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.soDangKyCaBiet' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.thoiGianXepGia' }),
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.donGia' }),
			width: 120,
			align: 'right',
			// Chưa có đơn giá (ĐKCB thêm tay không gắn dòng xếp giá, dòng xếp giá chưa nhập giá) thì để trống
			render: (val, rec) => {
				const donGia = rec?.thongTinXepGia?.donGia;
				return _.isNil(donGia) ? null : `${inputFormat(donGia)} VNĐ`;
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.trangThai' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 130,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.lichSuDangKy' })}
						onClick={() => {
							setRecord(rec);
							setVisibleModal(true);
						}}
						type='link'
						icon={<HistoryOutlined />}
					/>
					<ThaoTacDKCB record={rec} getData={getData} getThongKe={getThongKe} />
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.danhSachDangKyCaBiet' })}>
			<StatDanhSachDKCB />

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab={intl.formatMessage({ id: 'sachtailieu.dkcb.tatCa' })} />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				rowSelection
				otherButtons={[
					<ButtonExtend
						key={'1'}
						onClick={() => setVisibleThemDKCB(true)}
						icon={<PlusCircleOutlined />}
						notHideText
						tooltip={intl.formatMessage({ id: 'sachtailieu.dkcb.themTayDKCB' })}
					>
						{intl.formatMessage({ id: 'sachtailieu.dkcb.themTayDKCB' })}
					</ButtonExtend>,
					<XoaNhieuDKCB key={'2'} getData={getData} getThongKe={getThongKe} />,
				]}
				hideCard
				Form={FormDangKyCaBiet}
				formProps={{ getData }}
				widthDrawer={800}
			/>

			<LichSuThueMuonPage
				title={intl.formatMessage({ id: 'sachtailieu.lichSuThueMuon' })}
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }}
			/>

			<ModalThemDKCB
				visible={visibleThemDKCB}
				setVisible={setVisibleThemDKCB}
				getData={getData}
				getThongKe={getThongKe}
			/>
		</Card>
	);
};

export default DangKyCaBietPage;
