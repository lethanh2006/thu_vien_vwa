import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { colorTrangThaiNopThuVien, type ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import dayjs from '@/utils/dayjs';
import { Button, Card, Descriptions, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const ChiTietThuVien = (props: any) => {
	const { title } = props;
	const { record } = useModel('quanlythuvien.danhsachdot');
	const [previewFile, setPreviewFile] = useState<{ file?: string; title?: string }>({});

	const renderPreviewFile = (file?: string, title?: string) =>
		file ? (
			<Button type='link' onClick={() => setPreviewFile({ file, title })}>
				Xem tài liệu
			</Button>
		) : (
			'--'
		);

	return (
		<Card title={`Chi tiết ${title?.toLowerCase()}`}>
			<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} labelStyle={{ fontWeight: 600 }}>
				<Descriptions.Item label='Tên đề tài' span={24}>
					{record?.tenDeTai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi công tác' span={24}>
					{record?.noiCongTac ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Người hướng dẫn'>{record?.nguoiHuongDan ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Số lưu chiểu'>{record?.soLuuChieu ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Loại'>{record?.loai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã học viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Họ tên tác giả'>{record?.hoTenTacGia ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.sinhVien?.ngaySinh ? dayjs(record?.sinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{record?.sinhVien?.soDienThoai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Chức danh'>{record?.chucDanh ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Học vị'>{record?.hocVi ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					{record?.trangThai ? (
						<Tag color={colorTrangThaiNopThuVien[record?.trangThai as ETrangThaiNopThuVien]}>{record?.trangThai}</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian nộp'>
					{record?.thoiGianNop ? dayjs(record?.thoiGianNop).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Chuyên ngành'>{record?.nganh?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã chuyên ngành'>{record?.maNganh ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Tài liệu toàn bộ đề tài'>
					{renderPreviewFile(record?.urlTaiLieu, 'Tài liệu toàn bộ đề tài')}
				</Descriptions.Item>
				<Descriptions.Item label='Tài liệu tóm tắt đề tài'>
					{renderPreviewFile(record?.urlTomTat, 'Tài liệu tóm tắt đề tài')}
				</Descriptions.Item>
				<Descriptions.Item label='Tài liệu minh chứng đề tài'>
					{renderPreviewFile(record?.urlTaiLieuMinhChung, 'Tài liệu minh chứng đề tài')}
				</Descriptions.Item>
			</Descriptions>
			<ModalExpandable
				title={previewFile.title ?? 'Xem trước tập tin'}
				width={1200}
				open={!!previewFile.file}
				footer={null}
				onCancel={() => setPreviewFile({})}
			>
				{previewFile.file ? <PreviewFile file={previewFile.file} /> : null}

				<div className='form-footer'>
					<Button onClick={() => setPreviewFile({})}>Đóng</Button>
				</div>
			</ModalExpandable>
		</Card>
	);
};

export default ChiTietThuVien;
