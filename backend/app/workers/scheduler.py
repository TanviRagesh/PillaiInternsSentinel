import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = BackgroundScheduler()

def poll_monitoring_sources():
    """
    This function will be run periodically by the scheduler.
    In a full implementation, this queries the database for all MonitoringSources 
    whose next_check_at is <= now, and spawns worker tasks to fetch them.
    """
    logger.info("Executing monitoring cycle...")
    # ... logic to dispatch tasks ...
    pass

def start_scheduler():
    logger.info("Starting monitoring scheduler...")
    # Add the polling job to run every 30 seconds
    scheduler.add_job(
        poll_monitoring_sources,
        trigger=IntervalTrigger(seconds=30),
        id="monitoring_dispatcher",
        name="Dispatch monitoring checks",
        replace_existing=True,
    )
    scheduler.start()

def stop_scheduler():
    logger.info("Stopping monitoring scheduler...")
    scheduler.shutdown()
