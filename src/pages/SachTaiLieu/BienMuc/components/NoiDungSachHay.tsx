import { Empty } from 'antd';
import { useIntl, useModel } from 'umi';

const NoiDungSachHay = () => {
	const { record } = useModel('sachtailieu.anpham.anpham');
	const intl = useIntl();

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
					description={<i>{intl.formatMessage({ id: 'sachtailieu.label.noInfo' })}</i>}
					style={{ margin: 'auto' }}
				/>
			)}
		</div>
	);
};

export default NoiDungSachHay;
