import { Descriptions } from 'antd';
import { useModel } from 'umi';

const ChiTietBienMuc = () => {
	const { record } = useModel('sachtailieu.anpham.anpham');
	const { danhSach } = useModel('sachtailieu.anpham.thongtinanpham');

	return (
		<Descriptions column={{ xs: 1, md: 2 }} bordered>
			<Descriptions.Item label='Số đăng ký tổng quát' span={24}>
				{record?.dotNhapSach?.ten ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Nhan đề chính [245$a]'>
				{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Tác giả [100$a]'>
				{danhSach?.find((item) => item?.tagCode === '100')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Kiểu bản ghi'>{record?.kieuBanGhi?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Dạng tài liệu'>{record?.dangTaiLieu?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Cấp thư mục'>{record?.capThuMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Vật mang tin'>{record?.vatMangTin?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Mẫu biên mục'>{record?.mauBienMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Độ mât'>{record?.doMat ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='ISBN [020$a]'>
				{danhSach?.find((item) => item?.tagCode === '020')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='ISSN [022$a]'>
				{danhSach?.find((item) => item?.tagCode === '022')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Số thứ tự của tập [245$n]'>
				{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$n')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Tên tập [245$p]'>
				{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$p')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Phụ đề [245$b]'>
				{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$b')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Thông tin trách nhiệm [245$c]'>
				{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$c')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Lần xuất bản [250$a]'>
				{danhSach?.find((item) => item?.tagCode === '250')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Nơi xuất bản [260$a]'>
				{danhSach?.find((item) => item?.tagCode === '260')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Năm xuất bản [260$c]'>
				{danhSach?.find((item) => item?.tagCode === '260')?.thuocTinhAnPham?.find((i) => i.code === '$c')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Nhà xuất bản [260$b]'>
				{danhSach?.find((item) => item?.tagCode === '260')?.thuocTinhAnPham?.find((i) => i.code === '$b')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Số trang [300$a]'>
				{danhSach?.find((item) => item?.tagCode === '300')?.thuocTinhAnPham?.find((i) => i.code === '$a')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Đặc điểm vật lý [300$b]'>
				{danhSach?.find((item) => item?.tagCode === '300')?.thuocTinhAnPham?.find((i) => i.code === '$b')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Khuôn khổ [300$c]'>
				{danhSach?.find((item) => item?.tagCode === '300')?.thuocTinhAnPham?.find((i) => i.code === '$c')?.value ??
					'--'}
			</Descriptions.Item>
			<Descriptions.Item label='Tư liệu đi kèm [300$e]'>
				{danhSach?.find((item) => item?.tagCode === '300')?.thuocTinhAnPham?.find((i) => i.code === '$e')?.value ??
					'--'}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietBienMuc;
