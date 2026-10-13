import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { thongKeMauSoDKCB } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { DollarOutlined, ExportOutlined, StarOutlined, StarTwoTone } from '@ant-design/icons';
import { Avatar, Card, Modal, Select, Tag, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import useColumnsThongTinAnPham, { NhanDeAnPham, populationAnPham } from './components/ColumnsThongTinAnPham';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';
import DanhSachDKCB from './DanhSachDKCB';

const CardAnPham = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { getModel, page, limit, handleView, record, setRecord } = useModel('sachtailieu.anpham.anpham');
	const { setVisibleForm } = useModel('sachtailieu.anpham.xepgia');
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleDKCB, setVisibleDKCB] = useState<boolean>(false);

	const getData = () => {
		getModel(
			{
				dotNhapSachId: recDot?._id,
				trangThai: ETrangThaiBienMuc.DA_BIEN_MUC,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			{ population: populationAnPham },
		);
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columnsThongTinAnPham = useColumnsThongTinAnPham((rec) => {
		setRecord(rec);
		setVisibleDKCB(true);
	});

	const handleExport = () => {
		setLoading(true);
		if (recDot?._id)
			thongKeMauSoDKCB(recDot?._id)
				.then((res) => {
					fileDownload(res.data, 'Mẫu số đăng ký cá biệt.xlsx');
				})
				.catch((error) => console.error('Export failed:', error))
				.finally(() => {
					setLoading(false);
				});
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.anh' }),
			dataIndex: 'urlScanBia',
			width: 80,
			align: 'center',
			render: (url: string, rec) => (
				<Avatar
					src={url ?? '/logo.png'}
					alt={rec?.nhanDe}
					shape='square'
					style={{ width: 40, height: 40, objectFit: 'cover' }}
				/>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.loaiAnPham' }),
			dataIndex: 'online',
			width: 120,
			align: 'center',
			render: (val) => (
				<Tag color={val ? 'green' : 'blue'}>
					{val
						? intl.formatMessage({ id: 'sachtailieu.anpham.anPhamSo' })
						: intl.formatMessage({ id: 'sachtailieu.anpham.anPhamVatLy' })}
				</Tag>
			),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.chonLoai' })}
					options={[
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.anPhamSo' }), value: true },
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.anPhamVatLy' }), value: false },
					]}
					allowClear
					showArrow
					showSearch
					optionFilterProp='label'
				/>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maTaiLieu' }),
			dataIndex: 'maTaiLieu',
			width: 150,
			render: (val, rec) =>
				val && (
					<>
						{val} {rec?.dotNhapSach?.dotNhapSachMoi && <img style={{ width: 30, height: 20 }} src={news} />}
					</>
				),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			dataIndex: 'nhanDe',
			width: 260,
			render: (val, rec) => <NhanDeAnPham record={rec} />,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' }),
			dataIndex: 'isSachHay',
			align: 'center',
			width: 80,
			render: (val) =>
				val ? (
					<Tooltip title={intl.formatMessage({ id: 'sachtailieu.anpham.laSachHay' })}>
						<StarTwoTone twoToneColor='#fadb14' style={{ fontSize: 20 }} />
					</Tooltip>
				) : (
					<Tooltip title={intl.formatMessage({ id: 'sachtailieu.anpham.khongPhaiSachHay' })}>
						<StarOutlined style={{ color: '#ccc', fontSize: 20 }} />
					</Tooltip>
				),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.locSachHay' })}
					options={[
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.laSachHay' }), value: true },
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.khongPhaiSachHay' }), value: false },
					]}
					allowClear
					showArrow
					showSearch
					optionFilterProp='label'
				/>
			),
			onCell,
		},
		...columnsThongTinAnPham,
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.doMat' }),
			align: 'center',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.trangThai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
					color={colorTrangThaiBienMuc[val as ETrangThaiBienMuc]}
				>
					{val}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiBienMuc),
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'sachtailieu.button.xepGia' })}
					onClick={() => {
						setRecord(rec);
						setVisibleForm(true);
					}}
					type='link'
					icon={<DollarOutlined />}
				/>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={ModalAnPham}
				formProps={{ getData }}
				widthDrawer={1200}
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<SelectDotNhapSach
						key={'1'}
						isSetRecord
						style={{ width: 250 }}
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
						allowClear
					/>,
					<ButtonExtend
						disabled={!recDot?._id}
						loading={loading}
						key='3'
						icon={<ExportOutlined />}
						onClick={() => handleExport()}
					>
						{intl.formatMessage({ id: 'sachtailieu.anpham.thongKeSoDKCB' })}
					</ButtonExtend>,
				]}
			/>

			<ModalXepGia getDataAnPham={getData} />

			<Modal
				title={`${intl.formatMessage({ id: 'sachtailieu.anpham.danhSachDangKyCaBiet' })} - ${record?.nhanDe ?? ''}`}
				open={visibleDKCB}
				onCancel={() => setVisibleDKCB(false)}
				footer={null}
				width={1100}
				destroyOnClose
			>
				<DanhSachDKCB getDataAnPham={getData} />
			</Modal>
		</Card>
	);
};

export default CardAnPham;
