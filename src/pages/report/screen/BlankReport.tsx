import React from 'react';
import BlankReportView from '../component/BlankReportView';

type BlankReportRouteParams = {
  params?: {
    title?: string;
  };
};

type BlankReportProps = {
  route?: {
    params?: BlankReportRouteParams;
  };
};

const BlankReport: React.FC<BlankReportProps> = props => {
  const reportParams = props.route?.params?.params ?? {};

  return <BlankReportView title={reportParams.title} />;
};

export default BlankReport;
