import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';

import { exportThuVien } from '@/services/QuanLyThuVien';
import {
	colorTrangThaiNopThuVien,
	ELoaiDotQuanLyThuvien,
	ETrangThaiNopThuVien,
} from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
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
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import ChiTietThuVien from './components/ChiTiet';
import FormQuanLyThuVien from './components/Form';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import SelectDotThuVien from '../QuanLyDot/components/Select';

const QuanLyThuVienPage = () => {
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('quanlythuvien.quanlydot');
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
	} = useModel('quanlythuvien.danhsachdot');
	const [loai, setLoai] = useState<ELoaiDotQuanLyThuvien>(ELoaiDotQuanLyThuvien.LUAN_AN);
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
				values: [moment(datePicker?.[0]).startOf('date'), moment(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel(
			loai === ELoaiDotQuanLyThuvien.LUAN_AN ? { loai } : { idDot: recDot?._id, loai },
			datePicker ? filter : (undefined as any),
		);
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
			title: 'Số lưu chiểu',
			dataIndex: 'soLuuChieu',
			align: 'center',
			width: 150,
		},
		{
			title: 'Mã học viên',
			dataIndex: 'maSinhVien',
			filterType: 'string',
			width: 180,
		},
		{
			title: 'Họ và tên tác giả',
			dataIndex: 'hoTenTacGia',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Ngày sinh',
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.sinhVien?.ngaySinh && moment(rec?.sinhVien?.ngaySinh)?.format('DD/MM/YYYY'),
		},
		{
			title: 'Số điện thoại',
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.sinhVien?.soDienThoai,
		},
		{
			title: 'Tên đề tài',
			dataIndex: 'tenDeTai',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Người hướng dẫn',
			dataIndex: 'nguoiHuongDan',
			align: 'center',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Tài liệu toàn bộ đề tài',
			dataIndex: 'urlTaiLieu',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Tài liệu tóm tắt đề tài',
			dataIndex: 'urlTomTat',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Tài liệu minh chứng đề tài',
			dataIndex: 'urlTaiLieuMinhChung',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Thời gian nộp',
			dataIndex: 'thoiGianNop',
			align: 'center',
			width: 150,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Chức danh',
			dataIndex: 'chucDanh',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nơi công tác',
			dataIndex: 'noiCongTac',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Học vị',
			dataIndex: 'hocVi',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec?.nganh?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
		},
		{
			title: 'Mã ngành',
			align: 'center',
			width: 180,
			render: (val, rec) => rec?.maNganh,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			fixed: 'right',
			width: 150,
			render: (val, rec) => <Tag color={colorTrangThaiNopThuVien[val as ETrangThaiNopThuVien]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopThuVien),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topLeft'
					content={
						<>
							<ButtonExtend tooltip='Xem chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />

							<ButtonExtend
								onClick={() => handleEdit(rec)}
								disabled={
									rec?.trangThai === ETrangThaiNopThuVien.DA_DUYET || rec?.trangThai === ETrangThaiNopThuVien.TU_CHOI
								}
								tooltip='Chỉnh sửa'
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
								title='Bạn có chắc chắn muốn duyệt?'
								placement='topRight'
							>
								<ButtonExtend
									loading={loadingTrangThai}
									disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
									tooltip='Duyệt'
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
								title='Bạn có chắc chắn muốn từ chối?'
								placement='topRight'
							>
								<ButtonExtend
									loading={loadingTrangThai}
									disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
									tooltip='Từ chối'
									type='link'
									danger
									icon={<CloseOutlined />}
								/>
							</Popconfirm>

							<ButtonExtend
								disabled={rec?.trangThai !== ETrangThaiNopThuVien.DA_DUYET}
								type='link'
								icon={<PrinterOutlined />}
								tooltip='Export giấy biên nhận'
								onClick={() => onExportNhuCau(rec?._id)}
							/>

							<Popconfirm
								onConfirm={() => deleteModel(rec?._id, getData)}
								title='Bạn có chắc chắn muốn xóa thông tin này?'
								placement='topRight'
							>
								<ButtonExtend
									disabled={rec?.trangThai === ETrangThaiNopThuVien.DA_DUYET}
									tooltip='Xóa'
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
		<Card title='Danh sách sinh viên'>
			<Tabs activeKey={loai} onChange={(tab) => setLoai(tab as ELoaiDotQuanLyThuvien)}>
				{Object.values(ELoaiDotQuanLyThuvien).map((tab) => (
					<Tabs.TabPane key={tab} tab={tab} />
				))}
			</Tabs>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
				<Space>
					{loai !== ELoaiDotQuanLyThuvien.LUAN_AN && (
						<SelectDotThuVien
							isSetRecord
							value={recDot?._id}
							style={{ width: 250 }}
							onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
						/>
					)}

					<MyDateRangePicker
						value={datePicker}
						onChange={(val) => setDatePicker(val)}
						allowClear
						style={{ width: 300 }}
					/>
				</Space>
				<Space>
					Số lưu chiểu hiện tại:{' '}
					<InputNumber
						style={{ width: 110 }}
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
						Lưu
					</Button>
				</Space>
			</div>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, datePicker, recDot?._id]}
				modelName='quanlythuvien.danhsachdot'
				Form={isView ? ChiTietThuVien : FormQuanLyThuVien}
				formProps={{ getData, loai }}
				title={
					loai === ELoaiDotQuanLyThuvien.LUAN_AN
						? 'Quản lý luận án'
						: loai === ELoaiDotQuanLyThuvien.LUAN_VAN
						? 'Quản lý luận văn'
						: 'Quản lý khóa luận/đồ án'
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
