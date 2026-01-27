import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDonViSo = (props: any) => {
	const { form, onCancel, setIsChangeTree, isChangeTree } = props;
	const { record, edit, postModel, putModel, formSubmiting, visibleForm, getAllModel } = useModel('danhmuc.donviso');
	const intl = useIntl();

	useEffect(() => {
		const initvalue = record?.parentId;

		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id && edit) form.setFieldsValue(record);

		form.setFieldsValue({
			parentId: initvalue,
		});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DonViSo.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getAllModel)
				.then(() => {
					setIsChangeTree(!isChangeTree);
				})
				.catch((er) => console.log(er));
		} else {
			postModel(values, getAllModel)
				.then(() => {
					setIsChangeTree(!isChangeTree);
				})
				.catch((er) => console.log(er));
		}

		onCancel();
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				{/* {record?._id ? (
					<Col span={24}>
						<Form.Item name='maLinhVucCha' label='Lĩnh vực chung'>
							<SelectLinhVucChiTiet />
						</Form.Item>
					</Col>
				) : null} */}

				<Col span={24}>
					<Form.Item
						name='ma'
						label={intl.formatMessage({ id: 'danhmuc.donviso.form.label.malinhvuc' })}
						rules={[...rules.required, ...rules.length(80)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'danhmuc.donviso.form.placeholder.nhapmalinhvuc' })} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='ten'
						label={intl.formatMessage({ id: 'danhmuc.donviso.form.label.tenlinhvuc' })}
						rules={[...rules.required, ...rules.length(250)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'danhmuc.donviso.form.placeholder.nhaptenlinhvuc' })} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'danhmuc.donviso.form.button.themmoi' })
						: intl.formatMessage({ id: 'danhmuc.donviso.form.button.luu' })}
				</Button>
				<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'danhmuc.donviso.form.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormDonViSo;
