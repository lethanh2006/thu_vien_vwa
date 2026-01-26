import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';

import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import { exportThuVien } from '@/services/QuanLyThuVien';
import {
	colorTrangThaiNopThuVien,
	ELoaiDotQuanLyThuvien,
	ETrangThaiNopThuVien,
} from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import dayjs from '@/utils/dayjs';
import { getFilenameHeader } from '@/utils/utils';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	MenuOutlined,
	PrinterOutlined,
} from '@ant-design/icons';
import { Button, Card, InputNumber, Popconfirm, Popover, Space, Tabs, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietThuVien from './components/ChiTiet';
import FormQuanLyThuVien from './components/Form';

const QuanLyThuVienPage = () => {
	const intl = useIntl();
	const {
		getModel,
		page,
		limit,
		getSettingThuVienModel,
		settingThuVien,
		postSettingThuVienModel,
		formSubmiting,
		handleView,
		handleEdit,
		deleteModel,
		isView,
		changeTrangThaiLuanAnModel,
		loadingTrangThai,
		loai,
		setLoai,
	} = useModel('quanlythuvien.danhsachdot');

	const [datePicker, setDatePicker] = useState<any>();
	const luanAnValue = useRef(settingThuVien?.luanAn);

	useEffect(() => {
		getSettingThuVienModel();
	}, []);

	const getData = () => {
		const filter = [
			{
				active: true,
				field: 'thoiGianNop',
				values: [dayjs(datePicker?.[0]).startOf('date'), dayjs(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel({ loai }, datePicker ? filter : (undefined as any));
	};

	const handleSave = () => {
		if (luanAnValue.current !== undefined) {
			postSettingThuVienModel(
				loai === ELoaiDotQuanLyThuvien.LUAN_AN
					? {
							luanAn: luanAnValue.current,
							luanVan: settingThuVien?.luanVan || 0,
							khoaLuan: settingThuVien?.khoaLuan || 0,
						}
					: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
						? {
								luanVan: luanAnValue.current,
								luanAn: settingThuVien?.luanAn || 0,
								khoaLuan: settingThuVien?.khoaLuan || 0,
							}
						: {
								khoaLuan: luanAnValue.current,
								luanVan: settingThuVien?.luanVan || 0,
								luanAn: settingThuVien?.luanAn || 0,
							},
			);
		}
	};

	const handleChange = (value: number) => {
		luanAnValue.current = value;
	};

	const onExportNhuCau = (id: string) => {
		exportThuVien(
			id,
			loai === ELoaiDotQuanLyThuvien.LUAN_AN
				? 'luan-an'
				: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
					? 'luan-van'
					: 'khoa-luan-do-an',
		).then((res) => fileDownload(res.data, getFilenameHeader(res)));
	};

	const columns: IColumn<QuanLyThuVien.IQuanLyDanhSachNop>[] = [
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.soLuuChieu' }),
			dataIndex: 'soLuuChieu',
			align: 'center',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.maSinhVien' }),
			dataIndex: 'maSinhVien',
			filterType: 'string',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.hoTenTacGia' }),
			dataIndex: 'hoTenTacGia',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.ngaySinh' }),
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.sinhVien?.ngaySinh && dayjs(rec?.sinhVien?.ngaySinh)?.format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.soDienThoai' }),
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.sinhVien?.soDienThoai,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDeTai' }),
			dataIndex: 'tenDeTai',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' }),
			dataIndex: 'nguoiHuongDan',
			align: 'center',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuToanBoDeTai' }),
			dataIndex: 'urlTaiLieu',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemTaiLieu' })}
					</a>
				),
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuTomTat' }),
			dataIndex: 'urlTomTat',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemTaiLieu' })}
					</a>
				),
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuMinhChung' }),
			dataIndex: 'urlTaiLieuMinhChung',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemTaiLieu' })}
					</a>
				),
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGianNop' }),
			dataIndex: 'thoiGianNop',
			align: 'center',
			width: 150,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.chucDanh' }),
			dataIndex: 'chucDanh',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.noiCongTac' }),
			dataIndex: 'noiCongTac',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.hocVi' }),
			dataIndex: 'hocVi',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.nganh' }),
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec?.nganh?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.maChuyenNganh' }),
			align: 'center',
			width: 180,
			render: (val, rec) => rec?.maNganh,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.trangThai' }),
			dataIndex: 'trangThai',
			align: 'center',
			fixed: 'right',
			width: 150,
			render: (val, rec) => <Tag color={colorTrangThaiNopThuVien[val as ETrangThaiNopThuVien]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopThuVien),
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.table.column.thaoTac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topLeft'
					content={
						<>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemChiTiet' })}
								onClick={() => handleView(rec)}
								type='link'
								icon={<EyeOutlined />}
							/>

							<ButtonExtend
								onClick={() => handleEdit(rec)}
								disabled={
									rec?.trangThai === ETrangThaiNopThuVien.DA_DUYET || rec?.trangThai === ETrangThaiNopThuVien.TU_CHOI
								}
								tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemChiTiet' })}
								type='link'
								icon={<EditOutlined />}
							/>

							<Popconfirm
								onConfirm={() =>
									changeTrangThaiLuanAnModel(
										rec?._id,
										{
											trangThai: ETrangThaiNopThuVien.DA_DUYET,
										},
										getData,
									)
								}
								title={intl.formatMessage({ id: 'luananluanvankhoaluan.confirm.duyet' })}
								placement='topRight'
							>
								<ButtonExtend
									loading={loadingTrangThai}
									disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
									tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.duyet' })}
									type='link'
									className='text-success'
									icon={<CheckOutlined />}
								/>
							</Popconfirm>

							<Popconfirm
								onConfirm={() =>
									changeTrangThaiLuanAnModel(
										rec?._id,
										{
											trangThai: ETrangThaiNopThuVien.TU_CHOI,
										},
										getData,
									)
								}
								title={intl.formatMessage({ id: 'luananluanvankhoaluan.confirm.tuChoi' })}
								placement='topRight'
							>
								<ButtonExtend
									loading={loadingTrangThai}
									disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
									tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.tuChoi' })}
									type='link'
									danger
									icon={<CloseOutlined />}
								/>
							</Popconfirm>

							<ButtonExtend
								disabled={rec?.trangThai !== ETrangThaiNopThuVien.DA_DUYET}
								type='link'
								icon={<PrinterOutlined />}
								tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.exportGiayBienNhan' })}
								onClick={() => onExportNhuCau(rec?._id)}
							/>

							<Popconfirm
								onConfirm={() => deleteModel(rec?._id, getData)}
								title={intl.formatMessage({ id: 'luananluanvankhoaluan.confirm.banCoChacChanMuonXoa' })}
								placement='topRight'
							>
								<ButtonExtend
									disabled={rec?.trangThai === ETrangThaiNopThuVien.DA_DUYET}
									tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.button.xoa' })}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'luananluanvankhoaluan.card.title.danhSachSinhVien' })}>
			<div style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={datePicker}
					onChange={(val) => setDatePicker(val)}
					allowClear
					style={{ width: 300 }}
				/>
			</div>

			<Tabs activeKey={loai} onChange={(tab) => setLoai(tab as ELoaiDotQuanLyThuvien)}>
				{Object.values(ELoaiDotQuanLyThuvien).map((tab) => (
					<Tabs.TabPane key={tab} tab={tab} />
				))}
			</Tabs>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 }}>
				<Space>
					<span>{intl.formatMessage({ id: 'luananluanvankhoaluan.label.soLuuChieuHienTai' })}</span>
					<InputNumber
						style={{ width: 150 }}
						addonBefore={
							loai === ELoaiDotQuanLyThuvien.LUAN_AN
								? 'LA-'
								: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
									? 'LV-'
									: 'KL-DA-'
						}
						value={
							loai === ELoaiDotQuanLyThuvien.LUAN_AN
								? settingThuVien?.luanAn
								: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
									? settingThuVien?.luanVan
									: settingThuVien?.khoaLuan
						}
						onChange={(val) => handleChange(Number(val))}
					/>
					<Button loading={formSubmiting} type='primary' onClick={handleSave}>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				</Space>
			</div>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, datePicker, loai]}
				modelName='quanlythuvien.danhsachdot'
				Form={isView ? ChiTietThuVien : FormQuanLyThuVien}
				formProps={{ getData, loai }}
				title={
					loai === ELoaiDotQuanLyThuvien.LUAN_AN
						? intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyLuanAn' })
						: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
							? intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyLuanVan' })
							: intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyKhoaLuanDoAn' })
				}
				widthDrawer={1000}
				hideCard
				buttons={{ create: loai === ELoaiDotQuanLyThuvien.LUAN_AN ? true : false }}
				// otherButtons={
				// 	[
				// 		<ButtonExtend key='1' icon={<DownloadOutlined />}>
				// 			Tải tài liệu tác giải
				// 		</ButtonExtend>,
				// 	]
				// }
			/>
		</Card>
	);
};

export default QuanLyThuVienPage;
