package pl.put.poznan.rulestudio.model;

import java.util.concurrent.TimeUnit;

public class CalculationsStopWatch {
    private Long startTime;
    private Long stopTime;
    private Long estimatedTime;
    private String readableTime;

    public CalculationsStopWatch() {
        this.startTime = System.nanoTime();
    }

    public void stop() {
        this.stopTime = System.nanoTime();
        this.estimatedTime = this.stopTime - this.startTime;

        long hours = TimeUnit.NANOSECONDS.toHours(this.estimatedTime);
        long minutes = TimeUnit.NANOSECONDS.toMinutes(this.estimatedTime) - TimeUnit.HOURS.toMinutes(TimeUnit.NANOSECONDS.toHours(this.estimatedTime));
        long seconds = TimeUnit.NANOSECONDS.toSeconds(this.estimatedTime) - TimeUnit.MINUTES.toSeconds(TimeUnit.NANOSECONDS.toMinutes(this.estimatedTime));
        long millis = TimeUnit.NANOSECONDS.toMillis(this.estimatedTime) - TimeUnit.SECONDS.toMillis(TimeUnit.NANOSECONDS.toSeconds(this.estimatedTime));

        StringBuilder sb = new StringBuilder();
        boolean isStarted = false;

        if(hours != 0) {
            sb.append(hours).append(" h  ");
            isStarted = true;
        }

        if((minutes != 0) || (isStarted)) {
            if(isStarted) {
                sb.append(String.format("%02d min  ", minutes));
            } else {
                sb.append(minutes).append(" min  ");
                isStarted = true;
            }
        }

        if((seconds != 0) || (isStarted)) {
            if(isStarted) {
                sb.append(String.format("%02d s  ", seconds));
            } else {
                sb.append(seconds).append(" s  ");
                isStarted = true;
            }
        }

        if((millis != 0) || (isStarted)) {
            if(isStarted) {
                sb.append(String.format("%03d ms", millis));
            } else {
                sb.append(millis).append(" ms");
            }
        }

        this.readableTime = sb.toString();
    }

    public Long getEstimatedTime() {
        return estimatedTime;
    }

    public String getReadableTime() {
        return readableTime;
    }

    @Override
    public String toString() {
        return "CalculationsStopWatch{" +
                "startTime=" + startTime +
                ", stopTime=" + stopTime +
                ", estimatedTime=" + estimatedTime +
                ", readableTime='" + readableTime + '\'' +
                '}';
    }
}
