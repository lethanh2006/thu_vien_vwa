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
	EyeOutlined,
	FilePdfOutlined,
	MenuOutlined,
	StarOutlined,
	StarTwoTone,
	StopOutlined,
} from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover, Select, Tag, Tooltip } from 'antd';
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
			title: 'Loại ấn phẩm',
			dataIndex: 'online',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? 'green' : 'blue'}>{val ? 'Ấn phẩm số' : 'Ấn phẩm vật lý'}</Tag>,
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder='Chọn loại ấn phẩm'
					options={[
						{ label: 'Ấn phẩm số', value: true },
						{ label: 'Ấn phẩm vật lý', value: false },
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
			title: 'Mã tài liệu',
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
			title: 'Sách hay',
			dataIndex: 'isSachHay',
			align: 'center',
			width: 80,
			render: (val) =>
				val ? (
					<Tooltip title='Sách hay'>
						<StarTwoTone twoToneColor='#fadb14' style={{ fontSize: 20 }} />
					</Tooltip>
				) : (
					<Tooltip title='Không phải sách hay'>
						<StarOutlined style={{ color: '#ccc', fontSize: 20 }} />
					</Tooltip>
				),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder='Lọc sách hay'
					options={[
						{ label: 'Sách hay', value: true },
						{ label: 'Không', value: false },
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
			title: 'Kiểu bản ghi',
			dataIndex: 'maKieuBanGhi',
			width: 150,
			render: (val, rec) => rec?.kieuBanGhi?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuBanGhi multiple />,
			onCell,
		},
		{
			title: 'Dạng tài liệu',
			dataIndex: 'maDangTaiLieu',
			width: 150,
			render: (val, rec) => rec?.dangTaiLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectDangTaiLieu multiple selectMa />,
			onCell,
		},
		{
			title: 'Cấp thư mục',
			dataIndex: 'maCapThuMuc',
			width: 150,
			render: (val, rec) => rec?.capThuMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectCapThuMuc multiple />,
			onCell,
		},
		{
			title: 'Vật mang tin',
			dataIndex: 'maVatMangTin',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple />,
			onCell,
		},
		{
			title: 'Mẫu biên mục',
			dataIndex: 'mauBienMucId',
			width: 150,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
			onCell,
		},
		{
			title: 'Độ mật',
			align: 'center',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
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
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popover
						placement='topRight'
						content={
							<>
								<ButtonExtend
									tooltip='Ấn phẩm số'
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
										title='Xác nhận xóa ấn phẩm số khỏi dspace?'
										placement='topRight'
									>
										<ButtonExtend tooltip='Xóa phẩm số' type='link' icon={<StopOutlined />} />
									</Popconfirm>
								) : null}
								{!rec?.isSachHay ? (
									<ButtonExtend
										tooltip='Sách hay'
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
										title='Xác nhận đây bỏ sách hay này?'
										placement='topRight'
									>
										<ButtonExtend tooltip='Bỏ sách hay' type='link' danger icon={<StarTwoTone />} />
									</Popconfirm>
								)}
								<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
								<ButtonExtend
									tooltip='Xếp giá'
									onClick={() => {
										setRecord(rec);
										setVisibleForm(true);
									}}
									type='link'
									icon={<DollarOutlined />}
								/>
								<ButtonExtend
									onClick={() => setVisibleXoa(true)}
									tooltip='Xóa'
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
						Thống kê số ĐKCB
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
