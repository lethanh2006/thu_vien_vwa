import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ChiTietAnPham = () => {
	const intl = useIntl();
	const { record: recAnPham, setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const { getModel, danhSach, total, page, setPage, limit, setLimit, loading } = useModel(
		'sachtailieu.anpham.thongtinanpham',
	);

	useEffect(() => {
		getModel({ anPhamId: recAnPham?._id });
	}, [recAnPham?._id, page, limit]);

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	return (
		<Card title='Chi tiết ấn phẩm'>
			<div>
				<h2>
					{recAnPham?.ten} {recAnPham?.nhanDe}
				</h2>
				<UserOutlined /> {recAnPham?.tacGia}
			</div>
			<Spin spinning={loading}>
				<div style={{ marginTop: 12 }}>
					{danhSach?.map((item) => (
						<div key={item?._id}>
							<b>
								{item?.tagCode ?? ''}
								{item?.value ?? ''}
							</b>
							<ul>
								{item?.danhSachThuocTinhAnPham?.map((val) => (
									<li key={val?._id}>
										{val?.code}
										{val?.value}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Spin>
			<Pagination
				onChange={onChangePaging}
				current={page}
				pageSize={limit}
				total={total}
				style={{ textAlign: 'center' }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ChiTietAnPham;
