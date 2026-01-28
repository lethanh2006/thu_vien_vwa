import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import { thongKeMauSoDKCB } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import {
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	ExportOutlined,
	FilePdfOutlined,
	MenuOutlined,
	StarOutlined,
	StarTwoTone,
	StopOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm, Popover, Select, Tag, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import ModalAnPhamSo from '../BienMuc/components/AnPhamSo';
import ConfirmXoaAnPham from '../BienMuc/components/ConfirmXoa';
import ModalBienMucTaiLieu from '../BienMuc/components/Modal';
import ModalSachHay from '../BienMuc/components/ModalSachHay';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';

const CardAnPham = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const {
		getModel,
		page,
		limit,
		handleView,
		setRecord,
		deleteAnPhamSoModel,
		isView,
		handleEdit,
		putBienMucSoLuocModel,
	} = useModel('sachtailieu.anpham.anpham');
	const { setVisibleForm } = useModel('sachtailieu.anpham.xepgia');
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleSachHay, setVisibleSachHay] = useState<boolean>(false);
	const [visibleAnPhanSo, setVisibleAnPhamSo] = useState<boolean>(false);
	const [visibleXoa, setVisibleXoa] = useState<boolean>(false);

	const getData = () => {
		getModel({
			dotNhapSachId: recDot?._id,
			trangThai: ETrangThaiBienMuc.DA_BIEN_MUC,
		});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const handleSachHay = (rec: AnPham.IRecord, isSachHay: boolean) => {
		putBienMucSoLuocModel(rec?._id ?? '', { ...rec, isSachHay }, getData);
	};

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
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
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
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.kieuBanGhi' }),
			dataIndex: 'maKieuBanGhi',
			width: 150,
			render: (val, rec) => rec?.kieuBanGhi?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuBanGhi multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.dangTaiLieu' }),
			dataIndex: 'maDangTaiLieu',
			width: 150,
			render: (val, rec) => rec?.dangTaiLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectDangTaiLieu multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.capThuMuc' }),
			dataIndex: 'maCapThuMuc',
			width: 150,
			render: (val, rec) => rec?.capThuMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectCapThuMuc multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.vatMangTin' }),
			dataIndex: 'maVatMangTin',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.mauBienMuc' }),
			dataIndex: 'mauBienMucId',
			width: 150,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
			onCell,
		},
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
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popover
						placement='topRight'
						content={
							<>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.anPhamSo' })}
									type='link'
									icon={<FilePdfOutlined />}
									onClick={() => {
										setRecord(rec);
										setVisibleAnPhamSo(true);
									}}
								/>
								{rec?.online ? (
									<Popconfirm
										onConfirm={() => deleteAnPhamSoModel(rec?._id, getData)}
										title={intl.formatMessage({ id: 'sachtailieu.confirm.xoaAnPhamSo' })}
										placement='topRight'
									>
										<ButtonExtend
											tooltip={intl.formatMessage({ id: 'sachtailieu.button.xoaAnPhamSo' })}
											type='link'
											icon={<StopOutlined />}
										/>
									</Popconfirm>
								) : null}
								{!rec?.isSachHay ? (
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' })}
										type='link'
										className='text-success'
										icon={<StarOutlined />}
										onClick={() => {
											setRecord(rec);
											setVisibleSachHay(true);
										}}
									/>
								) : (
									<Popconfirm
										onConfirm={() => handleSachHay(rec, false)}
										title={intl.formatMessage({ id: 'sachtailieu.confirm.boSachHay' })}
										placement='topRight'
									>
										<ButtonExtend
											tooltip={intl.formatMessage({ id: 'sachtailieu.button.boSachHay' })}
											type='link'
											danger
											icon={<StarTwoTone />}
										/>
									</Popconfirm>
								)}
								{/* <ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} /> */}
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'sachtailieu.button.xepGia' })}
									onClick={() => {
										setRecord(rec);
										setVisibleForm(true);
									}}
									type='link'
									icon={<DollarOutlined />}
								/>
								<ButtonExtend
									onClick={() => {
										setRecord(rec);
										setVisibleXoa(true);
									}}
									tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
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
				dependencies={[page, limit, recDot?._id]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={isView ? ModalAnPham : ModalBienMucTaiLieu}
				formProps={{ getData, isBienMuc: false }}
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

			<ModalXepGia />

			<ModalSachHay visible={visibleSachHay} setVisible={setVisibleSachHay} getData={getData} />

			<ModalAnPhamSo visible={visibleAnPhanSo} setVisible={setVisibleAnPhamSo} getData={getData} />

			<ConfirmXoaAnPham visible={visibleXoa} setVisible={setVisibleXoa} getData={getData} />
		</Card>
	);
};

export default CardAnPham;
