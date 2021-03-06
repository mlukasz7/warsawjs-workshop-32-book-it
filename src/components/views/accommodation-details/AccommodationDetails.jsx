import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft.js';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight.js';
import { withStyles } from '@material-ui/core/styles';
import Price from '../../common/price/Price';
import Rating from '../../common/rating/Rating';
import Share from '../../common/share/Share';
import withErrors from '../../utils/withErrors';
import withFetching from '../../utils/withFetching';
import FacilityIcon from './facility-icon/FacilityIcon';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
  card: {
    maxWidth: '100%',
  },
  actions: {
    display: 'flex',
  },
  button: {
    margin: theme.spacing.unit,
  },
  floatRight: {
    marginLeft: 'auto',
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    margin: '0 auto',
  },
  facilities: {
    marginTop: theme.spacing.unit * 3,
  },
});

class AccommodationDetails extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    history: PropTypes.object,
    data: PropTypes.object.isRequired,
  };

  state = {
    activeStep: 0,
    shareId: '',
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  handleShareDialogOpen = (shareId) => {
    this.setState({ shareId });
  };

  handleShareDialogClose = () => {
    this.setState({ shareId: '' });
  };

  handleBackToList = () => {
    this.props.history.push('/');
  };

  render() {
    const { classes, theme, data } = this.props;
    const { activeStep } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Rating rating={data.rating} />}
          action={<Price price={data.price} />}
          title={data.title}
          subheader={data.address}
        />
        <div className={classes.root}>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={this.handleStepChange}
            enableMouseEvents
          >
            {data.images.map((image, index) => (
              <div key={index}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <img className={classes.img} src={image} alt="" />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={data.images.length}
            position="static"
            activeStep={activeStep}
            className={classes.mobileStepper}
            nextButton={
              <Button size="small" onClick={this.handleNext} disabled={activeStep === data.images.length - 1}>
                Next
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                Back
              </Button>
            }
          />
        </div>
        <CardContent>
          <Typography component="div">{data.description}</Typography>
          <FacilityIcon facilities={data.facilities} />
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Share
            id={data.id}
            open={this.state.shareId === data.id}
            onClose={this.handleShareDialogClose}
            onOpen={this.handleShareDialogOpen}
          />
          <Button
            aria-label="Back to list"
            className={classes.floatRight}
            onClick={this.handleBackToList}
          >
            Back to list
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withErrors(
  withFetching()(
    withRouter(
      withStyles(styles, { withTheme: true })(AccommodationDetails)
    )
  )
);
