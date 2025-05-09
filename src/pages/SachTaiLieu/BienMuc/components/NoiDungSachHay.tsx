import { Empty } from 'antd';
import { useModel } from 'umi';

const NoiDungSachHay = () => {
	const { record } = useModel('sachtailieu.anpham.anpham');

	return (
		<div style={{ marginTop: 12 }}>
			{record?.moTa ? (
				<div
					className='gioi-thieu-chung-content'
					style={{ display: 'block' }}
					dangerouslySetInnerHTML={{ __html: record?.moTa ?? '' }}
				/>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={<i>Không có thông tin</i>}
					style={{ margin: 'auto' }}
				/>
			)}
		</div>
	);
};

export default NoiDungSachHay;
