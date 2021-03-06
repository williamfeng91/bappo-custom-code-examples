import React from 'react';
import moment from 'moment';
import { styled, ActivityIndicator, View, Text } from 'bappo-components';

class Navigator extends React.Component {
  state = {
    errorMessage: null,
  };

  async componentWillMount() {
    const { $navigation, $global, $models } = this.props;
    const { currentUser } = $global;

    const currentConsultant = await $models.Consultant.findOne({
      where: {
        user_id: currentUser.id,
      },
    });

    if (!currentConsultant)
      return this.setState({
        errorMessage: 'You are not authorized to Timesheets',
      });

    // Find this week's timesheet
    const monday = moment()
      .day(1)
      .format('YYYY-MM-DD');
    let targetTimesheet;
    targetTimesheet = await $models.Timesheet.findOne({
      where: {
        week: monday,
        consultant_id: currentConsultant.id,
      },
    });

    if (!targetTimesheet) {
      // Create timesheet if not found
      targetTimesheet = await $models.Timesheet.create({
        week: monday,
        consultant_id: currentConsultant.id,
      });
    }

    // Navigate to this timesheet
    $navigation.navigate('TimesheetDetailsPage', {
      recordId: targetTimesheet.id,
    });
  }

  render() {
    const { errorMessage } = this.state;

    return (
      <Container>
        {errorMessage ? (
          <Message>{errorMessage}</Message>
        ) : (
          <ActivityIndicator />
        )}
      </Container>
    );
  }
}

export default Navigator;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Message = styled(Text)`
  font-size: 20px;
`;
